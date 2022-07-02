import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import './Login.scss'
import { checkEmail } from './../../utils/checkEmail'
import { useDispatch, useSelector } from 'react-redux'
import { loginSliceFetch } from '../../redux/features/user'
import { useNavigate, Link } from 'react-router-dom'

function Login(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.userState.user)
    const isUserFetching = useSelector(
        (state) => state.userState.isUserFetching
    )
    const loginError = useSelector((state) => state.userState.error)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true })
        }
    }, [user])

    const onEmailChange = (e) => {
        const { value } = e.target
        if (error == 'Please fill in the form') {
            setError('')
        }
        setEmail(value)
        setIsSubmit(false)
    }

    const onPasswordChange = (e) => {
        const { value } = e.target
        if (error == 'Please fill in the form') {
            setError('')
        }
        setPassword(value)
        setIsSubmit(false)
    }

    const onSubmit = () => {
        setIsSubmit(true)
        if (email === '' && password === '') {
            setError('Please fill in the form')
            return
        }
        if (
            (!checkEmail(email) && email !== '') ||
            email === '' ||
            password === ''
        ) {
            return
        }
        dispatch(
            loginSliceFetch({
                email,
                password,
            })
        )
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSubmit()
        }
    }

    return (
        <div className="login_form">
            <Typography
                style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    fontSize: '30px',
                }}
                variant="h6"
                component="h2"
            >
                Login
            </Typography>
            {error !== '' || loginError ? (
                <Typography
                    style={{
                        textAlign: 'center',
                        marginBottom: '15px',
                        fontSize: '16px',
                    }}
                    variant="h6"
                    component="h2"
                    color={'error.main'}
                >
                    {error || loginError}
                </Typography>
            ) : (
                ''
            )}
            <TextField
                className="login_form_input"
                id="outlined-basic"
                label="Email"
                variant="outlined"
                onChange={(e) => onEmailChange(e)}
                error={
                    (isSubmit && email === '') ||
                    (!checkEmail(email) && email !== '')
                }
                helperText={
                    !checkEmail(email) &&
                    isSubmit &&
                    email !== '' &&
                    'Please enter your email here'
                }
                onKeyDown={(e) => handleKeyDown(e)}
            />
            <TextField
                className="login_form_input"
                id="outlined-basic"
                label="Password"
                variant="outlined"
                onChange={(e) => onPasswordChange(e)}
                type={'password'}
                error={isSubmit && password === ''}
                onKeyDown={(e) => handleKeyDown(e)}
            />
            <Button
                className="login_form_btn"
                variant="outlined"
                onClick={() => onSubmit()}
            >
                Login
            </Button>
            <p style={{ display: 'flex', fontWeight: 500 }}>
                Don't have an account?
                <Link to={'/register'}>
                    <p style={{ color: '#1976d2', margin: '0 0 0 6px' }}>
                        Register here
                    </p>
                </Link>
            </p>
        </div>
    )
}

export default Login
