
import { StyleSheet } from 'react-native';

export const detailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        backgroundColor: '#3b4cca',
        paddingVertical: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    image: {
        width: 120,
        height: 120,
    },
    id: {
        fontSize: 14,
        color: '#ffffffaa',
        marginTop: 4,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'capitalize',
        marginTop: 4,
    },
    section: {
        margin: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 15,
        color: '#666',
    },
    value: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        textTransform: 'capitalize',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#e74c3c',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    abilityTag: {
        backgroundColor: '#3498db',
    },
    tagText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
}); 