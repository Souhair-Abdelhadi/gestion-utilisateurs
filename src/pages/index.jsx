import React from "react";
import {Button,Form} from 'react-bootstrap'
import {withRouter} from '../js/withRouter'
import $ from 'jquery'
import validator from "validator";
import {FaEye,FaEyeSlash} from "react-icons/fa"
import '../css/login.css'

 class Index extends React.Component{


    state =  {
        email : '',
        password : '',
        passwordType : "password",
        showPassword : true,
        isPending : false,
        error : '',
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        this.setState({
            error : "",isPending : true,
        })
        $("#email").css({
            "border-color" : "white !important",
        })
        $("#password").css({
            "border-color" : "white !important",
        })
        if( validator.isEmail(this.state.email) && this.state.password.length >= 8)
        {

            
            let headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            headers.append('Origin','http://localhost:3000');

            this.setState({isPending : true})

            fetch('http://localhost:3001/login',{
                mode :'cors',
                method : 'POST',
                headers : headers,
                body : JSON.stringify({
                    email : this.state.email,
                    password : this.state.password
                })
            })
            .then((res)=>{
                res.json().then((data)=>{
                    this.setState({isPending : false})
                    if(data.status == "OK"){
                        localStorage.setItem('user',JSON.stringify(data.user))
                        localStorage.setItem("isAuthenticated",true )
                        if(data.user.admin ===1){
                            this.props.navigate("/users_liste")
                        }
                        else{
                            this.props.navigate("/profile")
                        }                       

                    }
                    else if( data.status == "LOGIN_ERROR")  {
                        this.setState({error : data.message})

                    }
                })
                .catch(e=>{
                    console.log(e)
                    this.setState({isPending : false,error : "Une erreur s'est produite lors de la tentative de connexion"})
                    $("#email").css({
                        "border-color" : "red !important",
                    })
                })
            })
            .catch(e=>{
                console.log(e)
                this.setState({isPending : false,error : "Une erreur s'est produite lors de la tentative de connexion"})
                $("#email").css({
                    "border-color" : "red !important",
                })
            })
            
        }
        else {
            this.setState({isPending : false})
            if(!validator.isEmail(this.state.email))
            {
                this.setState({
                    error : "enter a valid email"
                })
                $("#email").css({
                    "border-color" : "red !important",
                })
            }
            else if(this.state.password.length < 8)
            {
                this.setState({
                    error : "enter password of length >= 8"
                })
                $("#password").css({
                    "border-color" : "red !important",
                })
            }
            
        }
    }
    showPassword = () =>{
        if(this.state.passwordType === "password"){
            this.setState({passwordType : "text",showPassword : false})
        }
        if(this.state.passwordType === "text"){
            this.setState({passwordType : "password",showPassword : true})
        }
    }
    




    render() {
        return (
            <div className="login_body" >

                
                <Form
                    onSubmit={ e => this.handleSubmit(e)}
                >
                    <div className="login_card">
                        <div className="login_header">
                            <h3 className="login_header_text"> Authentication</h3>
                        </div>
                        <div className="login_card_body">
                            <h5 className="login_error" id="login_error" > {this.state.error} </h5>
                            <div className="login_body_row" >
                                <div>
                                    <label htmlFor="email">Email : </label>
                                    <input required id="email"  type="email" placeholder="E-mail" onChange={(e)=> this.setState({email : e.target.value})} />

                                </div>
                            </div>
                            <div className="login_body_row" >
                                <div>
                                    <label htmlFor="password">Password : </label>
                                    <input required id="password" type={!this.state.showPassword ? "text" : "password"} minLength={8} maxLength={20}  placeholder="Password" onChange={(e)=> this.setState({password : e.target.value})} />
                                    {this.state.showPassword && <FaEye  onClick={this.showPassword} style={{
                                        height : 20,
                                        width : 20,
                                        position : 'absolute',
                                        marginTop : 6,
                                        marginLeft : -30
                                    }} />}
                                    {!this.state.showPassword && <FaEyeSlash  onClick={this.showPassword} style={{
                                        height : 20,
                                        width : 20,
                                        position : 'absolute',
                                        marginTop : 6,
                                        marginLeft : -30
                                    }} />}
                                </div>
                            </div>
                            <div className="login_body_row"  >
                                {!this.state.isPending && <Button className='submit_elem'  variant="primary" size="sm" type="submit">
                                    Login
                                </Button>}
                                {this.state.isPending && <Button className='submit_elem'  variant="primary" size="sm" type="submit">
                                    Login to your account ...
                                </Button>}
                            </div>
                        </div>
                    </div>
                </Form>

            </div>
        );
    }




 }

export default withRouter(Index)