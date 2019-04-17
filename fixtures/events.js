const Event = (name, siteName, price,
    ticketsRemaining, totalVisits, personalVisits) => ({
  name,
  siteName,
  price,
  ticketsRemaining,
  totalVisits,
  personalVisits
})

const events = [
  Event("Bus Tour", "Piedmont Park", 2.5, 20, 200, 0),
  Event("Bus Tour", "Inman Park", 2.5, 2, 53, 0),
  Event("Bus Tour", "Inman Park", 2.5, 2, 34, 0),
  Event("Bus Tour", "Inman Park", 2.5, 2, 23, 0),
  Event("Bus Tour", "Piedmont Park", 2.5, 2, 55, 0),
  Event("Bus Tour", "Inman Park", 2.5, 2, 55, 0),
]

export default events;
