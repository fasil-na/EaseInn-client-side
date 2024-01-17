import React from 'react'
import HeaderNoToken from '../../../Components/Guest/HeaderNoToken/HeaderNoToken'
import HotelCards from '../../../Components/Guest/HotelCards/HotelCards'
import SearchBox from '../../../Components/Guest/SearchBox/SearchBox'

function HomeNoToken() {
  return (
    <>
      <HeaderNoToken/>
      <SearchBox/>
      <HotelCards/>
    </>
  )
}

export default HomeNoToken
