import EventCard from '../EventComponents/EventCard';
import { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';


function CardContainerMyCreated(props) {
    const navTo = useNavigate();
    
  
    const clickHandler = (key) => (event) => {
      event.preventDefault();
      navTo(`/eventpage/${key}`); 
  
     } 
  const authContext = useContext(AuthContext);

  const cards = props.data.map((item) => {
    const key = item[0];
    return (
      item[1].uid === authContext.loggedUserID && (
        <div key={key}  onClick={clickHandler(key)}>
          <EventCard key={key} {...item[1]} />
        </div>
      )
    );
  });

  return (
    <div className="main">
      <h3>{props.title}</h3>
      <section className="cards-list">{cards}</section>
    </div>
  );
}

export default CardContainerMyCreated;
