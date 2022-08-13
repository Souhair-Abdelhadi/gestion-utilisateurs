import React, { Component } from 'react'
import "../css/interfaces_style.css"
import {Table,Button,InputGroup,FormControl} from "react-bootstrap"
import SideBar from '../components/sideBar'
import {AiFillCloseCircle} from "react-icons/ai"
import $ from 'jquery'
import { withRouter } from '../js/withRouter'

class ListeOfUser extends Component {

    constructor(props){
        super(props)
        this.redirect = this.redirect.bind(this)
        this.state = {
            users_liste : [],
            liste_loaded : false,
            src : null,
            list_to_show : [],
            imageOpened : false,
        }
        
    }

    redirect(path){
        this.props.navigate(path) 
    }

    toggleImage = (src) => {
        if(!this.state.imageOpened){
            var binary = '';
            var bytes = new Uint8Array( src.data );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            console.log("binary :",binary)
            this.setState({src : binary})
            this.setState({imageOpened : true})
        }
       else {
           this.setState({imageOpened : false})
       }
        $('#image_div').toggle('slow')
    }

    getData = ()=> {
       
        let headers = new Headers()
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Origin','http://localhost:3000');

        fetch('http://localhost:3001/users')
        .then((res)=>{
            res.json().then((data)=>{
                console.log(data)
                if(data.status == "OK"){
                    this.setState({list_to_show : data.doc,users_liste : data.doc})
                    
                }
                else if( data.status == "LOGIN_ERROR")  {
                    alert("Erreur survenu lors téléchargement des données dans serveur")

                }
            })
            .catch(e=>{
                console.log(e)
            })
        })
        .catch(e=>{
            console.log(e)
            
        })

    }

    formatDate = (date) => {
        try {
            var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
        return [day, month, year].join('/');
        } catch (error) {
            console.log(error)
            return "undefined"
        }
      }

    sortTable = (val) => {
        if(val == "0" ){ 
            var list = this.state.users_liste.filter((value)=>{
                if(value.bloquer === 0){
                    return value
                }
                
            })
            this.setState({list_to_show : [...list]})
        }
        else if(val == "1"){
            var list = this.state.users_liste.filter((value)=>{
                if(value.bloquer === 1){
                    return value
                }
                
            })
            this.setState({list_to_show : [...list]})
        }
        else {
                this.setState({list_to_show : [...this.state.users_liste]})
        }
    }

    deleteUser = (id)=> {
       
        let headers = new Headers()
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Origin','http://localhost:3000');
        fetch('http://localhost:3001/users/'+ id,{
            mode :'cors',
            method : 'DELETE',
            headers : headers
        })
        .then((res)=>{
            res.json().then((data)=>{
                console.log(data)
                if(data.status == "OK"){
                   this.getData()
                }
                else if( data.status == "LOGIN_ERROR")  {
                    alert(data.message)

                }
            })
            .catch(e=>{
                console.log(e)
                alert(e.message)
            })
        })
        .catch(e=>{
            console.log(e)
            alert(e.message)
        })

    }

    componentDidMount(){
        this.getData()
    }


  render() {
    return (
      <div>
            <SideBar>
                <div className='image_div' id='image_div'  >
                    <AiFillCloseCircle  className='close_icon' onClick={()=> this.toggleImage()} />
                    <img src={this.state.src} alt="user iimage" id='image' className='image' />
                </div>
                
                <div className='bar_actions' >
                { typeof JSON.parse(localStorage.getItem('user')).admin != 'undefined' && JSON.parse(localStorage.getItem('user')).admin === 1 ? <div>
                        <Button variant="info" onClick={()=> this.redirect("/addUser") } className='ajouter_user_btn' >Ajouter utilisateur</Button>
                    </div> : null}    
                  
                    <div>
                        <InputGroup className="mb-3 search_input">
                            <InputGroup.Text id="inputGroup-sizing-default"  >Search</InputGroup.Text>
                            <FormControl
                                aria-label="Search"
                                aria-describedby="inputGroup-sizing-default"
                                placeholder="nom d'utilisateur"
                                onChange={(inputValue)=>{
                                    if(inputValue.target.value.length != 0){ 
                                        var list = this.state.users_liste.filter((value)=>{
                                            if(value.nom.toLocaleLowerCase().search(inputValue.target.value.toLocaleLowerCase()) !=-1){
                                                return value
                                            }
                                            
                                        })
                                        this.setState({list_to_show : [...list]})
                                    }
                                    else {
                                            this.setState({list_to_show : [...this.state.users_liste]})
                                        }
                                }}
                            />
                        </InputGroup>
                    </div>
                   
                </div>
                <div className='interface_table' >
                    <div id='tab_sort' >
                        <label>Sort : </label>
                        <select name='_select_for_sort'  id="_select_for_sort"
                            onClick={(e)=> this.sortTable(e.target.value)}
                        >
                            <option value="tous">Tous</option>
                            <option value="1">Bloquer</option>
                            <option value="0">Non bloquer</option>
                        </select>
                    </div>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>id </th>
                                <th>Nom </th>
                                <th>Prénom</th>
                                <th>Date naissance</th>
                                <th>Email</th>
                                <th>Image</th>
                                <th>Admin</th>
                                <th>Bloquer</th>
                                {typeof JSON.parse(localStorage.getItem("user")).admin != 'undefined' && JSON.parse(localStorage.getItem("user")).admin === 1 ? 
                                <th>Les actions</th>
                                :null}
                            </tr>
                        </thead>
                        <tbody className='tbody_scroll' >
                            {this.state.list_to_show.sort((a,b)=> a.id - b.id ).map((value,index)=>{
                                if(value.email != JSON.parse(localStorage.getItem("user")).email ){
                                        
                                    return (
                                        <tr key={index} >
                                            <td>{value.id}</td>
                                            <td>{value.nom}</td>
                                            <td>{value.prenom}</td>
                                            <td>{this.formatDate(value.dateNaissance)}</td>
                                            <td>{value.email}</td>
                                            <td>
                                                <Button variant="primary" onClick={() => this.toggleImage(value.image)} >Voir</Button>
                                            </td>
                                            <td> { value.admin === 1 ? "Oui" : "Non"} </td>
                                            <td> { value.bloquer === 1 ? "Oui" : "Non"} </td>
                                            {typeof JSON.parse(localStorage.getItem("user")).admin != 'undefined' && JSON.parse(localStorage.getItem("user")).admin === 1 ? 

                                            <td>
                                                {typeof JSON.parse(localStorage.getItem("user")).admin != 'undefined' && JSON.parse(localStorage.getItem("user")).admin === 1
                                                    ? 
                                                    <Button size='sm'  onClick={()=>  this.redirect("/updateUser/"+value.id)}  >modifier</Button>

                                                :null}  
                                                {typeof JSON.parse(localStorage.getItem("user")).admin != 'undefined' && JSON.parse(localStorage.getItem("user")).admin === 1
                                                    ? 
                                                    <Button variant='danger' size='sm'  onClick={()=> {
                                                        this.deleteUser(value.id)
                                                    } }  >supprimer</Button>
                                                :null}  
                                            </td>
                                            :null}
                                        </tr>
                                    )
                                }
                                })}


                        </tbody>
                    </Table>
                </div>
            </SideBar>
      
      </div>
    )
  }
}


export default withRouter(ListeOfUser)