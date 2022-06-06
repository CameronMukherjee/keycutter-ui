import {Drawer, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import styles from '../styles/component/KcDrawer.module.css'
import {AcUnit, BarChart, FindInPage, Group, Hub, Receipt, Settings,} from "@mui/icons-material";
import {useRouter} from "next/router";

const KcDrawer = () => {
  const router = useRouter();

  const menuItems = [
    {
      text: 'User Management',
      icon: <Group color={"secondary"}/>,
      path: '/users'
    },
    {
      text: "Webhooks",
      icon: <Hub color={"secondary"}/>,
      path: "/webhook"
    },
    {
      text: 'Event Logs',
      icon: <Receipt color={"secondary"}/>,
      path: "/logs/events"
    },
    {
      text: 'Login Logs',
      icon: <FindInPage color={"secondary"}/>,
      path: "/logs/login"
    },
    {
      text: 'Retention Logs',
      icon: <AcUnit color={"secondary"}/>,
      path: "/logs/retention"
    },
    {
      text: 'Analytics',
      icon: <BarChart color={"secondary"}/>,
      path: '/analytics'
    },
    {
      text: "Server Config",
      icon: <Settings color={"secondary"}/>,
      path: "/config"
    }
  ];

  return (
      <Drawer
          className={styles.drawer}
          variant={"permanent"}
          anchor={"left"}
          classes={{paper: styles.drawer}}
      >
        {/*@ts-ignore*/}
        <div align={'center'} style={{paddingTop: 10}}>
          <h1>
            KeyCutter
          </h1>
        </div>
        <List>
          {menuItems.map(item => (
              <ListItem
                  key={item.text}
                  onClick={() => router.push(item.path)}
                  className={router.pathname == item.path ? styles.active : styles.non}
                  button>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text}/>
              </ListItem>
          ))}
        </List>
      </Drawer>
  )
}

export default KcDrawer;