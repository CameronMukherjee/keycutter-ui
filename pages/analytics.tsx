import KcPage from "../component/KcPage";
import {useEffect, useState} from "react";
import axios from 'axios';
import {useCookies} from "react-cookie";
import dynamic from "next/dynamic";

const MonthlyUserReg = dynamic(() => import('../component/MonthlyUserRegistrationLineChart'), {
  ssr: false
})

const Analytics = () => {
  const [monthlyUserData, setMonthlyUserData] = useState({});
  const [cookies, setCookie] = useCookies(['access_token'])

  useEffect(() => {
    axios.get('http://localhost:7314/operations/analytics/registrations/month', {
      headers: {
        "Authorization": `Bearer ${cookies.access_token}`
      }
    })
    .then(res => {
      const fini = [];

      if (res.data != null) {
        for (const element of res.data) {
          fini.push({
            x: element.day,
            y: element.registrations
          });
        }
      }

      const monthlyUserRegistrations = {
        "id": "User Registration",
        data: fini
      }

      console.log(monthlyUserRegistrations)
      setMonthlyUserData(monthlyUserRegistrations);
    })
    .catch(err => {
      console.log(err)
    })
  }, [cookies.access_token])

  return (
      <KcPage title={"Analytics"}>
        <p>Analytics</p>
        <div style={{height: '100vh', margin: '4rem'}}>
          <MonthlyUserReg data={monthlyUserData}/>

        </div>
      </KcPage>
  )
}

export default Analytics;