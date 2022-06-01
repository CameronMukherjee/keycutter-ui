import {Drawer, List, ListItem, ListItemIcon, ListItemText, Typography} from "@mui/material";
import styles from '../styles/component/KcDrawer.module.css'
import {BarChart, DocumentScanner, FindInPage, GraphicEq, Group, Home, VerifiedUser} from "@mui/icons-material";
import {useRouter} from "next/router";

const KcDrawer = () => {
  const router = useRouter();

  const menuItems = [
    {
      text: "Home",
      icon: <Home color={"secondary"}/>,
      path: "/dashboard"
    },
    {
      text: 'User Management',
      icon: <Group color={"secondary"}/>,
      path: '/users'
    },
    {
      text: 'Analytics',
      icon: <BarChart color={"secondary"}/>,
      path: '/analytics'
    },
    {
      text: 'Logs',
      icon: <FindInPage color={"secondary"}/>,
      path: "/logs"
    }
  ];

  return (
      <Drawer
          className={styles.drawer}
          variant={"permanent"}
          anchor={"left"}
          classes={{ paper: styles.drawer}}
      >
        {/*@ts-ignore*/}
        <div align={'center'} style={{paddingTop: 10}}>
          {/*<Typography variant={"h4"}>*/}
          {/*  KeyCutter UI*/}
          {/*</Typography>*/}
          <h1>
            KeyCutter UI
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