import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import './Register.scss'
import { checkEmail } from '../../utils/checkEmail'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { registerSliceFetch } from './features/register'
import moment from 'moment'

function Register(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isRegisterFetching = useSelector(
        (state) => state.registerState.isRegisterFetching
    )
    const registerError = useSelector((state) => state.registerState.error)
    const isRegisterSuccess = useSelector(
        (state) => state.registerState.isSuccess
    )

    const [isSubmit, setIsSubmit] = useState(false)
    const [error, setError] = useState('')
    const [registerContent, setRegisterContent] = useState({
        email: '',
        password: '',
        passwordAgain: '',
        DOB: '',
        fullName: '',
        phone: '',
        address: '',
    })

    useEffect(() => {
        if (isRegisterSuccess && !isRegisterFetching) {
            navigate('/login', { replace: true })
        }
    }, [isRegisterSuccess])

    const onTextFieldChange = (e) => {
        const { id, value } = e.target
        if (error == 'Please fill in the form') {
            setError('')
        }
        setRegisterContent((st) => ({
            ...st,
            [id]: value,
        }))
    }

    const onSubmit = () => {
        setIsSubmit(true)
        if (
            registerContent.email === '' ||
            registerContent.password === '' ||
            registerContent.passwordAgain === '' ||
            registerContent.DOB === '' ||
            registerContent.fullName === '' ||
            registerContent.phone === '' ||
            registerContent.address === ''
        ) {
            setError('Please fill in the form')
            return
        }
        if (registerContent.password != registerContent.passwordAgain) {
            setError('password is defferent')
            return
        }
        if (
            (!checkEmail(registerContent.email) &&
                registerContent.email !== '') ||
            registerContent.email === '' ||
            registerContent.password === ''
        ) {
            return
        }
        dispatch(
            registerSliceFetch({
                ...registerContent,
                DOB: `${registerContent.DOB.getDate()}/${
                    registerContent.DOB.getMonth() + 1
                }/${registerContent.DOB.getFullYear()}`,
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Typography
                    style={{
                        textAlign: 'center',
                        marginBottom: '30px',
                        fontSize: '30px',
                    }}
                    variant="h6"
                    component="h2"
                >
                    Register
                </Typography>
                {error !== '' || registerError ? (
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
                        {error || registerError}
                    </Typography>
                ) : (
                    ''
                )}
                <TextField
                    className="login_form_input"
                    id="email"
                    label="Email"
                    variant="outlined"
                    onChange={(e) => onTextFieldChange(e)}
                    error={
                        (isSubmit && registerContent.email === '') ||
                        (!checkEmail(registerContent.email) &&
                            registerContent.email !== '')
                    }
                    helperText={
                        !checkEmail(registerContent.email) &&
                        isSubmit &&
                        registerContent.email !== '' &&
                        'Please enter your email here'
                    }
                    onKeyDown={(e) => handleKeyDown(e)}
                    value={registerContent.email}
                />
                <TextField
                    className="login_form_input"
                    id="password"
                    label="Password"
                    variant="outlined"
                    value={registerContent.password}
                    onChange={(e) => onTextFieldChange(e)}
                    type="password"
                    error={isSubmit && registerContent.password === ''}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <TextField
                    className="login_form_input"
                    id="passwordAgain"
                    label="Password again"
                    variant="outlined"
                    value={registerContent.passwordAgain}
                    onChange={(e) => onTextFieldChange(e)}
                    type="password"
                    error={isSubmit && registerContent.passwordAgain === ''}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <TextField
                    className="login_form_input"
                    id="fullName"
                    label="Full name"
                    variant="outlined"
                    value={registerContent.fullName}
                    onChange={(e) => onTextFieldChange(e)}
                    error={isSubmit && registerContent.fullName === ''}
                    onKeyDown={(e) => handleKeyDown(e)}
                />

                <DatePicker
                    id="DOB"
                    label="Date of birth"
                    inputFormat="dd/MM/yyyy"
                    value={registerContent.DOB}
                    sx={{ width: '400px' }}
                    onChange={(newValue) =>
                        onTextFieldChange({
                            target: {
                                id: 'DOB',
                                value: newValue,
                            },
                        })
                    }
                    formatDate={(date) => moment(date).format('DD/MM/YYYY')}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{ width: '210px' }}
                            className="login_form_input"
                            value={registerContent.DOB}
                            error={isSubmit && registerContent.DOB === ''}
                        />
                    )}
                />

                <TextField
                    className="login_form_input"
                    id="phone"
                    label="Phone"
                    variant="outlined"
                    value={registerContent.phone}
                    onChange={(e) => onTextFieldChange(e)}
                    error={isSubmit && registerContent.phone === ''}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <TextField
                    className="login_form_input"
                    id="address"
                    label="Address"
                    variant="outlined"
                    value={registerContent.address}
                    onChange={(e) => onTextFieldChange(e)}
                    error={isSubmit && registerContent.address === ''}
                    onKeyDown={(e) => handleKeyDown(e)}
                />

                <Button
                    className="login_form_btn"
                    variant="outlined"
                    onClick={() => onSubmit()}
                >
                    Submit
                </Button>
            </LocalizationProvider>
        </div>
    )
}

export default Register
