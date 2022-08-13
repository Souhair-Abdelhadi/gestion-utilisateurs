import React, { Component } from 'react'
import "../css/interfaces_style.css"
import {Form,Button,InputGroup,Row} from "react-bootstrap"
import SideBar from '../components/sideBar'
import {AiFillCloseCircle} from "react-icons/ai"
import $ from 'jquery'
import {withRouter} from '../js/withRouter'

class Profile extends Component {

    constructor(props){
        super(props)
        this.state = {
            validated : false,
            nom : '',
            prenom : '',
            email : '',
            dateNaissance : '',
            bloquer : 0,
            admin : 0,
            password : '',
            src : '',
            imageLoaded : false,
            loaded : false,
            id : JSON.parse(localStorage.getItem("user")).id
        }



    }

    toggleImage = () => {
        $('#image_div').toggle('slow')
    } 


    loadImage = (src) => {
        if(!this.state.imageLoaded){
            var binary = '';
            var bytes = new Uint8Array( src.data );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            this.setState({src : binary,imageLoaded : true})

        }
    }

    generatePassword = () => {
        var randomstring = Math.random().toString(36).slice(-11);
        this.setState({password : randomstring})
    }

    verifyImage = (file) => {
        var ext_list = ["jpg", "jpeg", "png"]
        
        var ext = file.target.value.substring(file.target.value.lastIndexOf('.') + 1, file.target.value.length) || null;
        var reader = new FileReader()
         
        reader.onload = () =>{
            
            $("#image").attr("src",reader.result)
            this.setState({src : reader.result})
            console.log("data after setState :",this.state.src)
        }
        if(file.target.value.length > 0){
            if (ext && ext_list.includes(ext) ) {
                console.log("image a été selectionné")
                $("#image_error").text("image a été selectionné").css("color", "green")
                reader.readAsDataURL(file.target.files[0])
                
            }
            else {
                console.log("le fichier selectionné n'est une image ")
                $("#image_error").text("le fichier selectionné n'est pas une image ").css("color", "red")
            }
        }
    }

    handleSubmit = (event) => {
        $('#error_message').text("")
        $('#image_error').text("")
        const form = event.currentTarget;
        if (form.checkValidity() === false || !this.state.src ) {
            if(!this.state.src){
                $("#image_error").text("Il faut selectionner une image de l'automate ").css("color", "red")

            }
          event.preventDefault();
          event.stopPropagation();
        }
        else { 
            event.preventDefault()
            let headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            headers.append('Origin','http://localhost:3000');
            
            fetch('http://localhost:3001/profile',{
                mode :'cors',
                method : 'PUT',
                headers : headers,
                body : JSON.stringify({
                    nom : this.state.nom,
                    prenom : this.state.prenom,
                    dateNaissance : this.state.dateNaissance,
                    password : this.state.password,
                    bloquer : this.state.bloquer,
                    email : this.state.email,
                    userIsAdmin : this.state.admin,
                    image : this.state.src,
                    id : this.state.id,
                    prevEmail : JSON.parse(localStorage.getItem("user")).email
                })
            })
            .then((res)=>{
                res.json().then((data)=>{
                    console.log(data)
                    var user = JSON.parse(localStorage.getItem("user"))
                    if(data.status == "OK"){
                        user.email = this.state.email
                        localStorage.setItem("user",JSON.stringify(user))
                        window.location.reload()
                    }
                    $('#error_message').css("color","red")
                    $('#error_message').text(data.message)
                })
            })
            .catch(e=> {
                $('#error_message').text(e.message)
            })

            
        }
        this.setState({validated : true})

    };


    getUser = ()=> {
       
        let headers = new Headers()
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Origin','http://localhost:3000');
        fetch('http://localhost:3001/users/'+ this.state.id)
        .then((res)=>{
            res.json().then((data)=>{
                console.log(data)
                if(data.status == "OK"){
                    this.setState({
                        nom : data.doc[0].nom,
                        prenom : data.doc[0].prenom,
                        email : data.doc[0].email,
                        dateNaissance : this.formatDate(data.doc[0].dateNaissance,'-'),
                        bloquer : data.doc[0].bloquer,
                        admin : data.doc[0].admin,
                        password : data.doc[0].password,
                    })
                    console.log(data.doc[0].dateNaissance)
                    this.loadImage(data.doc[0].image)
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

    formatDate = (date,split_character) => {
        try {
            var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
        return [year, month, day].join(split_character);
        } catch (error) {
            console.log(error)
            return "undefined"
        }
      }
    

    componentDidMount(){
         if(!this.state.loaded){
            this.getUser()
            this.setState({loaded : true})
         }
    }
   

  render() {
    return (
      <div>
            <SideBar>
                <div className='image_div' id='image_div'  >
                    <AiFillCloseCircle className='close_icon' onClick={() => this.toggleImage()} />
                    <img src={this.state.src} alt="User image" id='image' className='image' />
                </div>
            
                <div className='error_div' >
                    <p id='error_message' > </p>
                </div>


                <Form id='form' className='form_box'  noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>

                    <Form.Group className='form_div' as={Row} controlId="validationCustomUsername">

                        <br />
                        <InputGroup className='input_group mb-3' hasValidation>
                            <InputGroup.Text   id="inputGroup-sizing-lg">Nom </InputGroup.Text>
                            <Form.Control
                                onChange={(e)=>this.setState({nom : e.target.value})}
                                className='input_text'
                                type="text"
                                placeholder="Nom "
                                aria-describedby="inputGroupPrepend"
                                required
                                value={this.state.nom}
                            />
                            
                            <Form.Control.Feedback className='feed_back' type="invalid">
                               Donner Nom d'utlisateur.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <br />
                        <InputGroup className='input_group mb-3' hasValidation>
                            <InputGroup.Text id="inputGroup-sizing-lg">Prénom </InputGroup.Text>
                            <Form.Control
                                onChange={(e)=>this.setState({prenom : e.target.value})}
                                className='input_text'
                                type="text"
                                placeholder="Prénom"
                                aria-describedby="inputGroupPrepend"
                                required
                                value={this.state.prenom}
                            />
                            
                            <Form.Control.Feedback className='feed_back' type="invalid">
                                Donner prénom d'utlisateur.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <br />
                        <InputGroup className='input_group mb-3' hasValidation>
                            <InputGroup.Text id="inputGroup-sizing-lg">Date Naissance </InputGroup.Text>
                            <Form.Control
                                onChange={(e)=>this.setState({dateNaissance : e.target.value})}
                                className='input_text'
                                type="date"
                                placeholder="date naissance"
                                aria-describedby="inputGroupPrepend"
                                required
                                value={this.formatDate(this.state.dateNaissance,'-')}
                            />
                            
                            <Form.Control.Feedback className='feed_back' type="invalid">
                                Donner date naissance d'utlisateur.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <br />
                        <InputGroup className='input_group' hasValidation>
                            <InputGroup.Text id="inputGroup-sizing-lg">E-mail</InputGroup.Text>
                            <Form.Control
                                onChange={(e)=>this.setState({email : e.target.value})}
                                className='input_text'
                                type="email"
                                value={this.state.email}
                                placeholder="Email"
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Form.Control.Feedback className='feed_back' type="invalid">
                              Donner email d'utlisateur.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <br />
                        <InputGroup className='input_group mb-3'  hasValidation>
                            <InputGroup.Text id="inputGroup-sizing-lg">Mot de passe</InputGroup.Text>
                            <Form.Control
                                onChange={(e)=>this.setState({password : e.target.value})}
                                className='input_text'
                                type="text"
                                placeholder="Mot de passe"
                                minLength={8}
                                maxLength={20}
                                value={this.state.password}
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <Button variant='info' onClick={()=> this.generatePassword()}  > Generer </Button>
                            <Form.Control.Feedback className='feed_back' type="invalid">
                                S'il vous plait entrée le mot de passe.
                            </Form.Control.Feedback>
                        </InputGroup>                        
                        <br />
                        <InputGroup className='input_group mb-3' hasValidation>
                            <InputGroup.Text id="inputGroup-sizing-lg">Image </InputGroup.Text>
                            <input type="file"  id="automate_img"  onChange={(e)=>this.verifyImage(e)}  />
                            <Button onClick={()=>{this.toggleImage()}} variant="primary" id="view_button">
                                View
                            </Button>
                            
                        </InputGroup>
                        <br />
                        <div >
                            <p id="image_error" ></p>
                        </div>
                        <br />

                        <Button id='submit' type='submit' variant="primary">Modifer</Button>

                    </Form.Group>
                </Form>

                
            </SideBar>
      
      </div>
    )
  }
}

export default withRouter(Profile)