import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import { Animated, StyleSheet, Text, View } from 'react-native';
import { Alert } from '../../components/alert';
import { Button } from '../../components/button';
import { Card } from '../../components/card';
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

    const fadeAnim = useRef(new Animated.Value(1)).current;

    const { signIn } = useAuth();

    function showAlert(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') {
        setAlertData({ title, message, type });
        setIsAlertVisible(true);
    }

    function switchMode(toRegister: boolean) {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setIsRegister(toRegister);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
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

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pokédex</Text>
            </View>

            <View style={styles.cardWrapper}>
                <Card>
                    <Animated.View style={[styles.loginForm, { opacity: fadeAnim }]}>
                        {!isRegister ? (
                            <>
                                <Input placeholder="Usuário" onChangeText={setLoginName} />
                                <Input placeholder="Senha" secureTextEntry onChangeText={setLoginSenha} />
                                <Button
                                    title={loginLoading ? 'Entrando...' : 'Entrar'}
                                    onPress={handleLogin}
                                    style={{ marginTop: 8 }}
                                />
                                <Text style={styles.switchText} onPress={() => switchMode(true)}>
                                    Não tem conta? Cadastre-se
                                </Text>
                            </>
                        ) : (
                            <>
                                <Input placeholder="Usuário" onChangeText={setRegName} />
                                <Input placeholder="Senha" secureTextEntry onChangeText={setRegSenha} />
                                <Button
                                    title={regLoading ? 'Cadastrando...' : 'Cadastrar'}
                                    onPress={handleRegister}
                                    style={{ marginTop: 8 }}
                                />
                                <Text style={styles.switchText} onPress={() => switchMode(false)}>
                                    Já tem conta? Faça login
                                </Text>
                            </>
                        )}
                    </Animated.View>
                </Card>
            </View>

            <Alert
                title={alertData.title}
                message={alertData.message}
                type={alertData.type}
                visible={isAlertVisible}
                onClose={() => {
                    setIsAlertVisible(false);
                    if (alertData.type === 'success') switchMode(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CC0000',
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    headerSub: {
        color: '#ffcccc',
        fontSize: 14,
    },
    cardWrapper: {
        backgroundColor: '#F5F5F0',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 48,
    },
    loginForm: {
        gap: 12,
    },
    switchText: {
        color: '#CC0000',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 4,
    },
});