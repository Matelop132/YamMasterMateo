import React, {useEffect, useContext, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Grid = () => {
    const socket = useContext(SocketContext);

    const [displayGrid, setDisplayGrid] = useState(false);
    const [canSelectCells, setCanSelectCells] = useState([]);
    const [grid, setGrid] = useState([]);
    const [playerId, setPlayerId] = useState("");

    const handleSelectCell = (cellId, rowIndex, cellIndex) => {
        if (canSelectCells) {
            socket.emit("game.grid.selected", { cellId, rowIndex, cellIndex });
        }
    };

    useEffect(() => {
        socket.on("game.grid.view-state", (data) => {
            console.log(data);
            setDisplayGrid(data['displayGrid']);
            setCanSelectCells(data['canSelectCells'])
            setGrid(data['grid']);
            setPlayerId(data['playerId']);
        });
    }, []);

    const renderCell = (cell, rowIndex, cellIndex) => {
        const isPlayerCell = cell.owner === playerId;
        const isOpponentCell = cell.owner !== null && cell.owner !== playerId;
        const isSelectable = cell.canBeChecked && !isPlayerCell && !isOpponentCell;

        return (
            <TouchableOpacity
                key={cell.id}
                style={[
                    styles.cell,
                    isPlayerCell && styles.playerOwnedCell,
                    isOpponentCell && styles.opponentOwnedCell,
                    isSelectable && styles.canBeCheckedCell,
                    rowIndex !== 0 && styles.topBorder,
                    cellIndex !== 0 && styles.leftBorder,
                ]}
                onPress={() => handleSelectCell(cell.id, rowIndex, cellIndex)}
                disabled={!isSelectable}
                activeOpacity={0.7}
            >
                <LinearGradient
                    colors={isPlayerCell ? ['#8E44AD', '#9B59B6'] : 
                           isOpponentCell ? ['#E74C3C', '#C0392B'] :
                           isSelectable ? ['#F1C40F', '#F39C12'] : 
                           ['#ECF0F1', '#BDC3C7']}
                    style={styles.cellGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={[
                        styles.cellText,
                        (isPlayerCell || isOpponentCell) && styles.ownedCellText
                    ]}>
                        {cell.viewContent}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.gridContainer}>
            {displayGrid &&
                grid.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, cellIndex) => renderCell(cell, rowIndex, cellIndex))}
                    </View>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flex: 7,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: width * 0.95,
        backgroundColor: "#2C3E50",
        margin: 10,
        padding: 8,
        borderRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    row: {
        flexDirection: "row",
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 4,
    },
    cell: {
        flex: 2,
        height: "100%",
        marginHorizontal: 4,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cellGradient: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },
    cellText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#2C3E50',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    ownedCellText: {
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    playerOwnedCell: {
        transform: [{ scale: 1.02 }],
    },
    opponentOwnedCell: {
        transform: [{ scale: 1.02 }],
    },
    canBeCheckedCell: {
        transform: [{ scale: 1.02 }],
    },
    topBorder: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    leftBorder: {
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    },
});

export default Grid;
