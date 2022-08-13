import {Nav} from "react-bootstrap"
import React, { Component } from 'react'
import "../css/sideBar.css"
import {GiExitDoor} from "react-icons/gi"
import { withRouter } from "../js/withRouter"
import {Link} from 'react-router-dom'

class SideBar extends Component {


    state = {
        image : ''
    }

    loadImage = (src) => {
            var binary = '';
            var bytes = new Uint8Array( src.data );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            this.setState({image : binary})
    }

    componentDidMount(){
        if(JSON.parse(localStorage.getItem("user")).image){
            this.loadImage(JSON.parse(localStorage.getItem("user")).image)
        }
    }

  render() {
    return (
        <div className="sidebar_grid">
            <div className="sidebar_container" >
                <GiExitDoor className="exit_icon" title="Logout" onClick={()=> {
                    localStorage.setItem("isAuthenticated",false)
                    localStorage.setItem('user',null)
                    this.props.navigate("/")
                } }  />
                <div >
                    <Nav defaultActiveKey="/home" className="flex-column nav_scroll"
                        navbarScroll={true} style={{ left: 0 }} >
                        <div className="profile">
                            <div className="user_name_email" > 
                                <div className="sidebar_user_image" >
                                    <img src= { typeof JSON.parse(localStorage.getItem("user")).image == 'undefined' || JSON.parse(localStorage.getItem("user")).image == null
                                        ? "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                                        : this.state.image
                                }
                                     alt="user" />
                                </div>
                                
                                <p> Bonjour {  JSON.parse(localStorage.getItem("user")).nom ? JSON.parse(localStorage.getItem("user")).nom.toUpperCase() +" " + JSON.parse(localStorage.getItem("user")).prenom : "" }  </p>
                                <p>{JSON.parse(localStorage.getItem("user")).email}</p>
                            </div>

                        </div>
                        { typeof JSON.parse(localStorage.getItem('user')).admin != 'undefined' && JSON.parse(localStorage.getItem('user')).admin === 1 ? <Link className="item" to="/users_liste">Utilisateurs</Link> : null}    
                        <Link className="item" to="/profile">Profile</Link>
                    </Nav>
                </div>
            </div>
            <div className="props_children" >
                {this.props.children}
            </div>
        </div>
    )
  }
}


export default withRouter(SideBar)