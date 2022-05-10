import EventCard from '../EventComponents/EventCard';

function CardContainer(props) {
  const cards = props.data.map((item) => {
    return <EventCard key={item.id} {...item} />;
  });
  return (
    <div className="main">
      <h3>{props.title}</h3>
      <section className="cards-list">{cards}</section>
    </div>
  );
}

export default CardContainer;
