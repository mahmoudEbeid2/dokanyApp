import { Share } from 'react-native';

export const useShare = () => {
    const shareContent = async (message, title) => {
        try {

            await Share.share({
                message,
                title
            });
        } catch (error) {
            console.error('Error sharing product:', error);
        }
    };

    return { shareContent };
};
