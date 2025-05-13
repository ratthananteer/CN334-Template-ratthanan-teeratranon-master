import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const response = await fetch('http://localhost:3342/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("data:",data);

            const decoded = jwtDecode(data.access);
            const user_id = decoded.user_id;

            localStorage.setItem('jwt_access', data.access);
            localStorage.setItem('token', data.access);
            localStorage.setItem('user_id', user_id)
            alert('Login success!');
            router.push('/homepage');
        } else {
            alert('Invalid email or password');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const response = await fetch('http://localhost:3342/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                username: formData.get('username'),
            }),
        });

        if (response.ok) {
            alert('Register success! Please login.');
            setIsRegistering(false);
        } else {
            alert('Registration failed');
        }
    };

    return (
        <>
            <Head>
                <title>{isRegistering ? 'Register' : 'Login'}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                rel="stylesheet"
                href="https://cdn.lineicons.com/4.0/lineicons.css"
                />
            </Head>

            <main>
                <div className={`container ${isRegistering ? 'right-panel-active' : ''}`} id="container">
                    <div className="form-container register-container">
                        <form onSubmit={handleRegister}>
                            <h1>Register</h1>
                            <input type="text" name="username" placeholder="Name" required />
                            <input type="email" name="email" placeholder="Email" required />
                            <input type="password" name="password" placeholder="Password" required />
                            <button type="submit">Register</button>
                        </form>
                    </div>

                    <div className="form-container login-container">
                        <form onSubmit={handleLogin}>
                            <h1>Login</h1>
                            <input type="email" name="email" placeholder="Email" required />
                            <input type="password" name="password" placeholder="Password" required />
                            <div className="content">
                                <div className="checkbox">
                                    <input type="checkbox" />
                                    <label>Remember me</label>
                                </div>
                                <div className="pass-link">
                                    <a href="#">Forgot password</a>
                                </div>
                            </div>
                            <button type="submit">Login</button>
                        </form>
                    </div>

                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1 className="title">Hello <br /> friends</h1>
                                <p>if you have an account, login here and have fun</p>
                                <button className="ghost" onClick={() => setIsRegistering(false)}>
                                    Login <i className="lni lni-arrow-left login"></i>
                                </button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1 className="title">Start you <br /> journy now</h1>
                                <p>if you don't have an account yet, join us and start your journey</p>
                                <button className="ghost" onClick={() => setIsRegistering(true)}>
                                    Register <i className="lni lni-arrow-right register"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                @import url("https://fonts.googleapis.com/css2?family-Poppins");

                * {
                    box-sizing: border-box;
                }

                main {
                    display: flex;
                    background-color: #f6f5f7;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    font-family: "Popoins", sans-serif;
                    overflow: hidden;
                    height: 100vh;
                }

                h1 {
                    font-size: 2vw;
                    margin: 0;
                    margin-bottom: 1.5vh;
                }

                h1.title {
                    font-size: 2vw;
                    line-height: 4.5vh;
                    margin: 0;
                    text-shadow: 0 0 10px rgba(16, 64, 74, 0.5);
                }

                p {
                    font-size: 0.8vw;
                    line-height: 2vh;
                    letter-spacing: 0.05vw;
                    margin: 2vh 0 3vh;
                    text-shadow: 0 0 10px rgba(16, 64, 74, 0.5);
                }

                a {
                    color: #333;
                    font-size: 0.8vw;
                    text-decoration: none;
                    margin: 1.5vh 0;
                    transition: 0.3s ease-in-out;
                }

                a:hover {
                    color: #4bb6b7;
                }

                .content {
                    display: flex;
                    width: 100%;
                    height: 5vh;
                    align-items: center;
                    justify-content: space-around;
                }

                .content .checkbox {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .content input {
                    accent-color: #333;
                    width: 0.8vw;
                    height: 1.2vh;
                }

                .content label {
                    font-size: 0.8vw;
                    user-select: none;
                    padding-left: 0.5vw;
                }

                button {
                    position: relative;
                    border-radius: 20px;
                    border: 1px solid #4bb6b7;
                    background-color: #4bb6b7;
                    color: #fff;
                    font-size: 0.8vw;
                    margin: 1vw;
                    padding: 1.3vh 4vw;
                    text-transform: capitalize;
                    transition: 0.3s ease-in-out;
                }

                button:hover {
                    letter-spacing: 0.3vw;
                }

                button:active {
                    transform: scale(0.95);
                }

                button:focus {
                    outline: none;
                }

                button.ghost {
                    background-color: rgba(225, 225, 225, 0.2);
                    border: 0.2vw solid #fff;
                    color: #fff;
                }

                button.ghost i{
                    position: absolute;
                    opacity: 0;
                    transition: 0.3s ease-in-out;
                }

                button.ghost i.register {
                    right: 70px;
                }

                button.ghost i.login {
                    left: 70px;
                }

                button.ghost:hover i.register {
                    right: 40px;
                    opacity: 1;
                }

                button.ghost:hover i.login {
                    left: 40px;
                    opacity: 1;
                }

                form {
                    background-color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    padding: 0 2vw;
                    height: 100%;
                    text-align: center;
                }

                input {
                    background-color: #eee;
                    border: none;
                    border-radius: 10px;
                    padding: 1.2vh 1.5vw;
                    margin: 0.8vh 0;
                    width: 100%;
                }

                .container {
                    background-color: #fff;
                    border-radius: 25px;
                    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
                    position: relative;
                    overflow: hidden;
                    width: 50vw;
                    height: 70vh;
                    max-width: 100%;
                    min-height: 500px;
                }

                .form-container {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    transition: all 0.6s ease-in-out;
                }

                .login-container {
                    left: 0;
                    width: 50%;
                    z-index: 2;
                }

                .container.right-panel-active .login-container {
                    transform: translateX(100%);
                }

                .register-container {
                    left: 0;
                    width: 50%;
                    opacity: 0;
                    z-index: 1;
                }

                .container.right-panel-active .register-container {
                    transform: translateX(100%);
                    opacity: 1;
                    z-index: 5;
                    animation: show 0.6s;
                }

                @keyframes show {
                    0%,
                    49.99% {
                        opacity: 0;
                        z-index: 1;
                    }

                    50%,
                    100% {
                        opacity: 1;
                        z-index: 5;
                    }
                }

                .overlay-container {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 50%;
                    height: 100%;
                    overflow: hidden;
                    transition: transform 0.6s ease-in-out;
                    z-index: 100;
                }

                .container.right-panel-active .overlay-container {
                    transform: translate(-100%);
                }

                .overlay {
                    background-image: url("/img/login_background.gif");
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: 0 0;
                    color: #fff;
                    position: relative;
                    left: -100%;
                    height: 100%;
                    width: 200%;
                    transform: translateX(0);
                    transition: transform 0.6s ease-in-out;
                }

                .overlay::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background: linear-gradient(
                        to top,
                        rgba(46, 94, 109, 0.4) 40%,
                        rgba(46, 94, 109, 0)
                    );
                }

                .container.right-panel-active .overlay {
                    transform: translateX(50%);
                }

                .overlay-panel {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    padding: 0 2vw;
                    text-align: center;
                    top: 0;
                    height: 100%;
                    width: 50%;
                    transform: translateX(0);
                    transition: trasnform 0.6s ease-in-out;
                }

                .overlay-left {
                    transform: translateX(-20%);
                }

                .container.right-panel-active .overlay-left {
                    transform: translateX(0);
                }

                .overlay-right {
                    right: 0;
                    transform: translateX(0);
                }

                .container.right-panel-active .overlay-right {
                    transform: translateX(20%);
                }
            `}</style>
        </>
    );
}
