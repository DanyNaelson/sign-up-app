import React, { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, CheckboxGroup, Form, Loader, Message, Schema, toaster } from 'rsuite'
import TextField from '../../text-field'
import 'rsuite/Button/styles/index.less';
import 'rsuite/Checkbox/styles/index.less';
import 'rsuite/Message/styles/index.less';
import 'rsuite/Loader/styles/index.less';
import 'rsuite/Form/styles/index.less';
import './index.less'
import { useTranslation } from 'react-i18next';
import { BASE_URL, DEFAULT_HEADERS } from '../../../utils/constants';
import PasswordTooltip from '../../password-tooltip';
import { selectLanguage } from '../../../utils';
import { setUser } from '../../../utils/localstorage';
import Field from '../../field';

const SignUpForm = () => {
    const { t, i18n } = useTranslation()
    const formRef = useRef();
    const [language, setLanguage] = useState('es')
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState({});
    const [formValue, setFormValue] = useState({
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        termsAndPrivacy: []
    });

    const model = Schema.Model({
        email: Schema.Types.StringType().isEmail(t('validations.invalidEmail')).isRequired(t('validations.isRequired')),
        phoneNumber: Schema.Types.StringType().isRequired(t('validations.isRequired')),
        password: Schema.Types.StringType().isRequired(t('validations.isRequired')),
        termsAndPrivacy: Schema.Types.ArrayType().isRequired(t('validations.areRequired')).minLength(2, t('validations.needAgreeTermsAndConditions')),
        confirmPassword: Schema.Types.StringType().isRequired(t('validations.isRequired')).addRule((value, data) => {
            if (value !== data.password)
                return false;

            return true;
        }, t('validations.confirmPassword'))
    })

    useEffect(() => {
        const lang = selectLanguage()
        lang && setLanguage(lang)
        lang === "en" && i18n.changeLanguage(lang)
    }, [])


    const handleSubmit = () => {console.log('submit')
        if (!formRef.current.check()) {
            return;
        }

        const { email, phoneNumber, password, confirmPassword } = formValue
        const body = {
            email,
            phoneNumber,
            password,
            confirmPassword,
        }

        setSubmitting(true)

        fetch(`${BASE_URL}/v1/register`, { headers: DEFAULT_HEADERS, method: 'POST', body: JSON.stringify(body) })
            .then(response => response.json())
            .then(result => {
                const { success } = result

                if (success) {
                    const { data: { userData, tokens } } = result
                    setUser(userData, tokens)
                    toaster.push(<Message showIcon type="success">{t('messages.success')}</Message>);
                    window.location.href = language == 'es' ? '/es/verificar-codigo' : '/en/verify-code'
                } else {
                    const { message, validationErrors } = result
                    const messageError = validationErrors && validationErrors.length > 0 ? validationErrors[0] : message
                    toaster.push(<Message showIcon type='error'>{t(`${messageError}`)}</Message>)
                }
            })
            .catch(error => {
                console.log(error.message);
            })
            .finally(() => setSubmitting(false))
    };

    return (
        <div id='form-container'>
            <p id='title-form'>{t('buttons.createAccount')}</p>
            <Form fluid
                ref={formRef}
                onChange={setFormValue}
                onCheck={setFormError}
                formValue={formValue}
                model={model}
            >
                <TextField name="email" label={t('fields.email')} placeholder={t('fields.emailExample')} value={formValue.email} />
                <TextField name="password" label={`${t('fields.password')} (${t('messages.atLeastCharacter', { characters: 8 })})`} placeholder={t('fields.enterPassword')} type="password" autoComplete="off" value={formValue.password} tooltipComp={<PasswordTooltip />} />
                <TextField name="confirmPassword" label={`${t('fields.confirmPassword')} (${t('messages.atLeastCharacter', { characters: 8 })})`} placeholder={t('fields.enterPassword')} type="password" autoComplete="off" value={formValue.confirmPassword} tooltipComp={<PasswordTooltip />} />
                <TextField name="phoneNumber" label={t('fields.telephoneNumber')} placeholder="+52 1234567890" value={formValue.phoneNumber} />
                <Field
                    name="termsAndPrivacy"
                    accepter={CheckboxGroup}
                    error={formError.termsAndPrivacy}
                    inline
                    className="checkbox-group-form"
                >
                    <Checkbox value="createAccount">{t('creatingAccount')} <a className='link-form' href='https://www.jefa.io/privacy'><b>{t('privacyPolicy')}</b></a> & <a className='link-form' href='https://www.jefa.io/terminos-y-condiciones-plataforma-jefa-linea-de-credito'><b>{t('termsAndConditionsJefa')}</b></a></Checkbox>
                    <Checkbox value="createAccountJefa">{t('creatingAccountJefa')} <a className='link-form' href='https://www.jefa.io/terminos-y-condiciones-plataforma-jefa-linea-de-credito'><b>{t('termsAndConditionsCommunityJefa')}</b></a></Checkbox>
                </Field>
                <Button id='submit-button' appearance="default" onClick={handleSubmit} type="submit">
                    {t('buttons.createAccount')}
                </Button>
            </Form>
            <p className='form-text'>{t('haveAccount')} <a href={language == 'es' ? '/es/inicio-de-sesion' : '/en/sign-in'} className='sign-in-text'>{t('signInText')}</a></p>
            {submitting && <Loader center size='lg' vertical backdrop />}
        </div>
    )
}

export default SignUpForm