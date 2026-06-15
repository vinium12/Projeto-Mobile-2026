import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import { StyleSheet, View } from 'react-native';
import { Alert } from '../../components/alert';
import { Button } from '../../components/button';
import { Input } from '../../components/input';

const API_URL = 'https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon';

export default function Index() {
    const [isRegister, setIsRegister] = useState(false);

    // Login
    const [loginName, setLoginName] = useState('');
    const [loginSenha, setLoginSenha] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Cadastro
    const [regName, setRegName] = useState('');
    const [regSenha, setRegSenha] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertData, setAlertData] = useState({
        title: '',
        message: '',
        type: 'success' as 'success' | 'error' | 'warning' | 'info',
    });

    const { signIn } = useAuth();

    function showAlert(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') {
        setAlertData({ title, message, type });
        setIsAlertVisible(true);
    }

    async function handleLogin() {
        if (!loginName || !loginSenha) {
            showAlert('Campos obrigatórios', 'Preencha o usuário e a senha.', 'warning');
            return;
        }
        setLoginLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/v1/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginName, password: loginSenha }),
            });
            const data = await response.json();
            if (response.ok) {
                await signIn(loginName, data.userId);
                router.push({ pathname: '/dashboard', params: { username: loginName } });
            } else {
                showAlert('Erro de Login', data.message || 'Credenciais inválidas.', 'error');
            }
        } catch {
            showAlert('Erro de conexão', 'Não foi possível conectar ao servidor.', 'error');
        } finally {
            setLoginLoading(false);
        }
    }

    async function handleRegister() {
        if (!regName || !regSenha) {
            showAlert('Campos obrigatórios', 'Preencha o usuário e a senha.', 'warning');
            return;
        }
        setRegLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/v1/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: regName, password: regSenha }),
            });
            const data = await response.json();
            if (response.ok) {
                showAlert('Conta criada!', 'Cadastro realizado com sucesso. Faça login!', 'success');
            } else {
                showAlert('Erro no cadastro', data.message || 'Não foi possível criar a conta.', 'error');
            }
        } catch {
            showAlert('Erro de conexão', 'Não foi possível conectar ao servidor.', 'error');
        } finally {
            setRegLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <style>{`
                .auth-wrapper {
                    display: flex;
                    flex: 1;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    overflow: hidden;
                }

                /* Painel branco (formulários) */
                .forms-panel {
                    position: absolute;
                    top: 0; bottom: 0;
                    width: 50%;
                    background: #F5F5F0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 48px;
                    transition: left 0.7s cubic-bezier(0.77, 0, 0.18, 1);
                    z-index: 1;
                }
                .forms-panel.login  { left: 50%; }
                .forms-panel.register { left: 0%; }

                .red-panel {
                    position: absolute;
                    top: 0; bottom: 0;
                    width: 50%;
                    background: #CC0000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 8px;
                    transition: left 0.7s cubic-bezier(0.77, 0, 0.18, 1);
                    z-index: 2;
                }
                .red-panel.login  { left: 0%; }
                .red-panel.register { left: 50%; }

                .panel-title {
                    color: #fff;
                    font-size: 52px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    font-family: serif;
                }
                .panel-sub {
                    color: #ffcccc;
                    font-size: 16px;
                    margin-bottom: 24px;
                }
                .switch-btn {
                    color: #fff;
                    font-weight: bold;
                    text-decoration: underline;
                    cursor: pointer;
                    font-size: 14px;
                    background: none;
                    border: none;
                    font-family: inherit;
                }
                .form-box {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 320px;
                }
                .link-text {
                    color: #CC0000;
                    text-decoration: none;
                    cursor: pointer;
                    text-align: center;
                    font-size: 14px;
                    background: none;
                    border: none;
                    zfontSize: 16,
                    fontWeight: 'bold',
                }
            `}</style>

            <div className="auth-wrapper">

                <div className={`forms-panel ${isRegister ? 'register' : 'login'}`}>
                    {!isRegister ? (
                        <div className="form-box">
                            <Input placeholder="Usuário" onChangeText={setLoginName} />
                            <Input placeholder="Senha" secureTextEntry onChangeText={setLoginSenha} />
                            <Button title={loginLoading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} style={{ marginTop: 8 }} />
                            <button className="link-text" onClick={() => setIsRegister(true)}>
                                Não tem conta? Cadastre-se
                            </button>
                        </div>
                    ) : (
                        <div className="form-box">
                            <Input placeholder="Usuário" onChangeText={setRegName} />
                            <Input placeholder="Senha" secureTextEntry onChangeText={setRegSenha} />
                            <Button title={regLoading ? 'Cadastrando...' : 'Cadastrar'} onPress={handleRegister} style={{ marginTop: 8 }} />
                            <button className="link-text" onClick={() => setIsRegister(false)}>
                                Já tem conta? Faça login
                            </button>
                        </div>
                    )}
                </div>

                <div className={`red-panel ${isRegister ? 'register' : 'login'}`}>
                    <span className="panel-title">Pokédex</span>
                </div>

            </div>

            <Alert
                title={alertData.title}
                message={alertData.message}
                type={alertData.type}
                visible={isAlertVisible}
                onClose={() => {
                    setIsAlertVisible(false);
                    if (alertData.type === 'success') setIsRegister(false);
                }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#CC0000',
    },
});