import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        margin: 12,
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginBottom: 8,
        padding: 12,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    sprite: {
        width: 50,
        height: 50,
    },
    cardInfo: {
        flex: 1,
        marginLeft: 12,
    },
    cardId: {
        fontSize: 12,
        color: '#999',
    },
    cardName: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    arrow: {
        fontSize: 24,
        color: '#ccc',
        marginLeft: 8,
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#999',
    },
});

