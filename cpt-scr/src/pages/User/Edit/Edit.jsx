import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import './Edit.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { checkEmail } from './../../../utils/checkEmail'

function Edit(props) {
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
    const [registerContent, setRegisterContent] = useState({
        DOB: '',
        fullName: '',
        phone: '',
        address: '',
    })

    // useEffect(() => {
    //     if (user) {
    //         navigate('/', { replace: true })
    //     }
    // }, [user])

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
        console.log(registerContent)
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
        // dispatch(
        //     loginSliceFetch({
        //         email,
        //         password,
        //     })
        // )
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSubmit()
        }
    }

    if (!user) {
        return <h1>Loading...</h1>
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
                    {user?.fullName}
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

export default Edit
