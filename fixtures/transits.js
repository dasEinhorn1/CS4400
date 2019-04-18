const Transit = (route, type, price, numSites, numLogs) => ({
  route, type, price, numSites, numLogs
});

const transits = [
  Transit('816', 'Bus', '2.5', '4', '1'),
  Transit('102', 'Bus', '2.5', '5', '3'),
  Transit('Blue', 'Marta', '2.5', '3', '5')
]

export default transits;