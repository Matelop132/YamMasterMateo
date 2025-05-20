import React, { useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import Board from "../components/board/board.component";
import { LinearGradient } from 'expo-linear-gradient';

export default function OnlineGameController({ navigation }) {
    const socket = useContext(SocketContext);
    const spinValue = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);

    useEffect(() => {
        // Animation de rotation continue
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Animation de fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        socket.emit("queue.join");
        setInQueue(false);
        setInGame(false);

        socket.on('queue.added', (data) => {
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
        });

        socket.on('game.start', (data) => {
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setIdOpponent(data['idOpponent']);
        });
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const leave = () => {
        socket.emit("queue.leave");
        navigation.navigate('HomeScreen');
    };

    return (
        <LinearGradient
            colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {!inQueue && !inGame && (
                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.paragraph}>
                        Connexion au serveur...
                    </Text>
                    <Animated.View style={[styles.loadingCircle, { transform: [{ rotate: spin }] }]} />
                </Animated.View>
            )}

            {inQueue && (
                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.paragraph}>
                        Recherche d'un adversaire...
                    </Text>
                    <Animated.View style={[styles.loadingCircle, { transform: [{ rotate: spin }] }]} />
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={leave}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={['#FF416C', '#FF4B2B']}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.buttonText}>Quitter</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {inGame && (
                <View style={styles.boardContainer}>
                    <Board navigation={navigation} />
                </View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    boardContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paragraph: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    loadingCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        borderTopColor: 'transparent',
        marginBottom: 30,
    },
    button: {
        width: 200,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});