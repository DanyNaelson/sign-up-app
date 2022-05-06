import React from 'react'
import { JefaLogo } from '../../svg'
import SignUpForm from './sign-up-form'
import './index.less'

const SignUp = () => {
    return (
        <div id='sections-container'>
            <JefaLogo id='logo' />
            <SignUpForm />
        </div>
    )
}

export default SignUp