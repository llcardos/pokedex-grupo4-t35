import { ReactNode, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
    children: ReactNode;
};

export default function GameBoyScreen({ children }: Props) {
    return (
        <View style={styles.consoleFrame}>
            <View style={styles.topLabelArea}>
                <View style={styles.redLight} />
                <Text style={styles.powerText}>POWER</Text>
            </View>

            <View style={styles.screenOuter}>
                <View style={styles.screenInner}>
                    {children}

                    <View style={styles.greenTint} pointerEvents="none" />
                    <View style={styles.scanlineOne} pointerEvents="none" />
                    <View style={styles.scanlineTwo} pointerEvents="none" />
                    <View style={styles.reflection} pointerEvents="none" />
                </View>
            </View>

            <Text style={styles.logoText}>
                GAME BOY <Text style={styles.colorText}>COLOR</Text>
            </Text>

            <View style={styles.controlsArea}>
                <View style={styles.dpad}>
                    <View style={styles.dpadUp} />

                    <View style={styles.dpadMiddleRow}>
                        <View style={styles.dpadLeft} />
                        <View style={styles.dpadCenter} />
                        <View style={styles.dpadRight} />
                    </View>

                    <View style={styles.dpadDown} />
                </View>

                <View style={styles.actionButtons}>
                    <View style={styles.buttonWrapper}>
                        <View style={styles.roundButton} />
                        <Text style={styles.buttonText}>B</Text>
                    </View>

                    <View style={[styles.buttonWrapper, styles.buttonA]}>
                        <View style={styles.roundButton} />
                        <Text style={styles.buttonText}>A</Text>
                    </View>
                </View>
            </View>

            <View style={styles.menuButtons}>
                <View style={styles.menuButtonWrapper}>
                    <View style={styles.menuButton} />
                    <Text style={styles.menuText}>SELECT</Text>
                </View>

                <View style={styles.menuButtonWrapper}>
                    <View style={styles.menuButton} />
                    <Text style={styles.menuText}>START</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    consoleFrame: {
        flex: 1,
        backgroundColor: '#5f6068',
        padding: 12,
        paddingTop: 16,
    },

    topLabelArea: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },

    redLight: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#d83333',
        marginRight: 6,
    },

    powerText: {
        fontSize: 10,
        color: '#222',
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    screenOuter: {
        flex: 1,
        backgroundColor: '#25272c',
        borderRadius: 18,
        padding: 10,
        borderWidth: 4,
        borderColor: '#17181c',
    },

    screenInner: {
        flex: 1,
        backgroundColor: '#9ba982',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },

    greenTint: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#8b956d',
        opacity: 0.18,
    },

    scanlineOne: {
        ...StyleSheet.absoluteFillObject,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.08)',
        opacity: 0.35,
    },

    scanlineTwo: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        opacity: 0.25,
    },

    reflection: {
        position: 'absolute',
        top: 12,
        left: 18,
        width: 120,
        height: 40,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        transform: [{ rotate: '-18deg' }],
    },

    logoText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#1f2230',
        letterSpacing: 1,
    },

    colorText: {
        color: '#7b2cbf',
    },

    controlsArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 22,
    },

    dpad: {
        width: 96,
        height: 96,
        alignItems: 'center',
        justifyContent: 'center',
    },

    dpadUp: {
        width: 30,
        height: 30,
        backgroundColor: '#202124',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },

    dpadMiddleRow: {
        flexDirection: 'row',
    },

    dpadLeft: {
        width: 30,
        height: 30,
        backgroundColor: '#202124',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },

    dpadCenter: {
        width: 30,
        height: 30,
        backgroundColor: '#202124',
    },

    dpadRight: {
        width: 30,
        height: 30,
        backgroundColor: '#202124',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },

    dpadDown: {
        width: 30,
        height: 30,
        backgroundColor: '#202124',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },

    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
        transform: [{ rotate: '-18deg' }],
    },

    buttonWrapper: {
        alignItems: 'center',
    },

    buttonA: {
        marginBottom: 26,
    },

    roundButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6d214f',
        borderWidth: 3,
        borderColor: '#3b102b',
    },

    buttonText: {
        marginTop: 5,
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1f2230',
    },

    menuButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 28,
        marginTop: 10,
        marginBottom: 4,
    },

    menuButtonWrapper: {
        alignItems: 'center',
    },

    menuButton: {
        width: 46,
        height: 12,
        borderRadius: 8,
        backgroundColor: '#2c2d33',
        transform: [{ rotate: '-12deg' }],
    },

    menuText: {
        marginTop: 6,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1f2230',
        letterSpacing: 1,
    },
});