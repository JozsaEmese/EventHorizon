import React from 'react';
import { MdClose } from 'react-icons/md';
import { auth } from '../../config/firebase';
import {
  readUser,
  createAttendee,
  readAttendee,
  readEvent,
} from '../../services/crud';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Payment from '../Paypal/Payment';

import { usePayPalScriptReducer } from '@paypal/react-paypal-js';

export default function JoinModal({
  showJoinModal,
  setShowJoinModal,
  eventData,
  eventId,
}) {
  const [userName, setUserName] = useState('');
  const [success, setSuccess] = useState(false);
  const [paidFor, setPaidFor] = useState(false);
  const [joinModalEvent, setJoinModalEvent] = useState([]);
  const [attendee, setAttendee] = useState([]);
  const [free, setFree] = useState(false);

  const [{ options }, dispatch] = usePayPalScriptReducer();

  let { id } = useParams();

  useEffect(() => {
    readEvent(id).then((snapshot) => setJoinModalEvent(snapshot.val() || {}));
  }, []);

  useEffect(() => {
    readAttendee(id).then((snapshot) =>
      setAttendee(Object.entries(snapshot.val() || {}))
    );
  }, []);

  useEffect(() => {
    if (eventData?.free === 'true') {
      setFree(true);
    }
  }, [eventData?.free]);

  const navTo = useNavigate();

  const CloseModalButton = MdClose;

  const clickJoinHandler = (event) => {
    event.preventDefault();
    if (auth.currentUser) {
      createAttendee(eventId, auth.currentUser.uid, userName);
      setSuccess(true);
      setTimeout(() => {
        navTo('/profile');
      }, 4000);
    } else {
      navTo('/signin');
    }
  };

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      readUser(auth.currentUser.uid).then((snapshot) =>
        setUserName(snapshot.val().username)
      );
    }
  }, []);

  function priceCheck() {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        currency: eventData.currency,
      },
    });
  }
  useEffect(() => {
    priceCheck();
  }, [eventData?.currency]);

  return (
    <>
      {showJoinModal ? (
        <div className="modal-background">
          <div className="ModalWrapper">
            <img
              className="ModalImg"
              src={
                eventData.image_url ? eventData.image_url : './blackhole.png'
              }
              alt="the event"
            />
            <div className="ModalContent">
              <h1>{eventData.title}</h1>

              <h4>{eventData.location}</h4>
              <br />
              <p>{eventData.date_from} </p>
              <br></br>
              <div>
                <label htmlFor="email">
                  Send this event to your friend, enter their email:
                </label>
                <input
                  className="JoinModalInput"
                  type="email"
                  id="email"
                  placeholder="email"
                  required
                ></input>
                <button className="ModalSendButton">Send Event</button>
              </div>
              {Number(joinModalEvent.user_limit) === attendee.length ? (
                <h3>Event is full</h3>
              ) : (
                <div>
                  <br />
                  {free ? (
                    <>
                      {!success && (
                        <button
                          className="ModalJoinButton"
                          onClick={clickJoinHandler}
                        >
                          Join Event
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {!success && (
                        <>
                          <div>
                            Event fee: {eventData.price} {eventData.currency}
                          </div>
                          <Payment
                            product={eventData}
                            paidfor={paidFor}
                            setPaidFor={setPaidFor}
                            setSuccess={setSuccess}
                            eventId={eventId}
                            userName={userName}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {success && (
                <div className="success">
                  <p>You successfully joined the event!</p>
                  <p>Redirecting you to your Profile</p>
                </div>
              )}
            </div>
            <CloseModalButton
              className="CloseModalButton"
              aria-label="Close modal"
              onClick={() => setShowJoinModal((prev) => !prev)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
