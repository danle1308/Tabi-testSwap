import Balance from 'components/Balance'

const TotalLpCell = ({ total }) => {
  return <Balance value={+total} fontSize={[12, , , , 14]} fontWeight="400" color="white" decimals={5} />
}

export default TotalLpCell
