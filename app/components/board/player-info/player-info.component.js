import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from '../../../contexts/socket.context';
import { LinearGradient } from 'expo-linear-gradient';

const PlayerInfo = () => {
    const socket = useContext(SocketContext);
    const [playerScore, setPlayerScore] = useState(0);
    const [playerPawns, setPlayerPawns] = useState(12);

    useEffect(() => {
        socket.on("game.player-info.view-state", (data) => {
            setPlayerScore(data['score']);
            setPlayerPawns(data['pawns']);
            console.log(data);
        });
    }, []);

    return (
        <View style={styles.playerInfosContainer}>
            <LinearGradient
                colors={['#8E44AD', '#9B59B6']}
                style={styles.gradientContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Pions</Text>
                    <Text style={styles.infoValue}>{playerPawns}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Score</Text>
                    <Text style={styles.infoValue}>{playerScore}</Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    playerInfosContainer: {
        width: '35%',
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    gradientContainer: {
        padding: 15,
        borderRadius: 15,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    infoLabel: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    infoValue: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});

export default PlayerInfo;
