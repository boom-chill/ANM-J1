import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import './ChangePassword.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { editSliceFetch } from '../Edit/features/edit'
import { BASE_API_URL } from './../../../api/index'
import axios from 'axios'

function ChangePassword(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.userState.user)
    const ChangePasswordUserError = useSelector(
        (state) => state.userState.error
    )

    const [isSubmit, setIsSubmit] = useState(false)
    const [error, setError] = useState('')
    const [ChangePasswordUserData, setChangePasswordUserData] = useState({})

    useEffect(() => {
        if (user) {
            //navigate('/', { replace: true })
            setChangePasswordUserData(user)
        }
    }, [user])

    const onTextFieldChange = (e) => {
        const { id, value } = e.target
        if (error == 'Please fill in the form') {
            setError('')
        }
        setChangePasswordUserData((st) => ({
            ...st,
            [id]: value,
        }))
    }

    const onSubmit = async () => {
        setIsSubmit(true)
        if (
            ChangePasswordUserData.password !=
            ChangePasswordUserData.passwordAgain
        ) {
            setError('password is defferent')
            return
        }
        if (user) {
            // dispatch(
            //     editSliceFetch({
            //         email: user.email,
            //         newPassword: ChangePasswordUserData,
            //     })
            // )
            await axios.post(`${BASE_API_URL}user/change-password`, {
                email: user.email,
                newPassword: ChangePasswordUserData.password,
            })
            navigate(-1)
        }
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
                    Change Password
                </Typography>
                {error !== '' || ChangePasswordUserError ? (
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
                        {error || ChangePasswordUserError}
                    </Typography>
                ) : (
                    ''
                )}
                <TextField
                    className="login_form_input"
                    id="password"
                    label="Password"
                    variant="outlined"
                    value={ChangePasswordUserData.password}
                    onChange={(e) => onTextFieldChange(e)}
                    type="password"
                    error={isSubmit && ChangePasswordUserData.password === ''}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <TextField
                    className="login_form_input"
                    id="passwordAgain"
                    label="Password again"
                    variant="outlined"
                    value={ChangePasswordUserData.passwordAgain}
                    onChange={(e) => onTextFieldChange(e)}
                    type="password"
                    error={
                        isSubmit && ChangePasswordUserData.passwordAgain === ''
                    }
                    onKeyDown={(e) => handleKeyDown(e)}
                />

                <Button
                    className="login_form_btn"
                    variant="outlined"
                    onClick={() => onSubmit()}
                    style={{ marginBottom: '15px', width: '200px' }}
                >
                    Change Password
                </Button>
                <Button
                    className="login_form_btn"
                    variant="contained"
                    onClick={() => navigate(-1)}
                    style={{ width: '200px' }}
                >
                    Back
                </Button>
            </LocalizationProvider>
        </div>
    )
}

export default ChangePassword
