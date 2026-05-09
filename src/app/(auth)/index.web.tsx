import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import { StyleSheet, Text, View } from 'react-native';
import { Alert } from '../../components/alert';
import { Button } from '../../components/button';
import { Card } from '../../components/card';
import { Input } from '../../components/input';

export default function Index() {
    const [name, setName] = useState<string>('');
    const [senha, setSenha] = useState<string>('');

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertData, setAlertData] = useState({ 
        title: '', 
        message: '',
        type: 'success' as 'success' | 'error' | 'warning' | 'info',
    });

    const { signIn } = useAuth();

    function validateCredentials() {
        if(name === 'kleber' && senha === '123') {
            signIn(name);
            router.push({ pathname: '/dashboard', params: { username: name } });
        } else {
            setAlertData({
                title: 'Erro de Login',
                message: 'Credenciais inválidas. Tente novamente.',
                type: 'error',
            });
            setIsAlertVisible(true);
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.left}>
                <Text style={styles.headerTitle}>Pokédex</Text>
            </View>

            <View style={styles.right}>

                <Card>
                    <View style={styles.loginForm}>
                        <Input placeholder="Usuário" onChangeText={setName} />
                        <Input placeholder="Senha" secureTextEntry onChangeText={setSenha} />
                        <Button title="Entrar" onPress={validateCredentials} style={{ marginTop: 8 }} />
                    </View>
                </Card>
            </View>

            <Alert 
                title={alertData.title}
                message={alertData.message}
                type={alertData.type}
                visible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#CC0000',
    },

    left: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 48,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 52,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    headerSub: {
        color: '#ffcccc',
        fontSize: 16,
    },

    right: {
        flex: 1,
        backgroundColor: '#F5F5F0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        gap: 20,
    },
    formTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
        alignSelf: 'flex-start',
    },
    loginForm: {
        gap: 12,
        width: 360,
    },
});