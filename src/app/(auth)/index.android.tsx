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
                title: 'Erro de       ',
                message: 'Credenciais inválidas. Tente novamente.',
                type: 'error',
            });
            setIsAlertVisible(true);
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pokédex</Text>
            </View>

            <View style={styles.cardWrapper}>
                <Card>
                    <View style={styles.loginForm}>
                        <Input placeholder="Usuário" onChangeText={setName} />
                        <Input placeholder="Senha" secureTextEntry onChangeText={setSenha} />
                        <Button title="Entrar" onPress={validateCredentials} style={{ marginTop: 8 }} />
                        <Text>Não tem senha? Cadastre-se</Text>
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
});