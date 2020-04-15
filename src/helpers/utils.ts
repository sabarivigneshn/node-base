import moment from 'moment';

export const getDateInFormat = (dateIn, format = 'YYYY-MM-DD') => {
    try {
        return moment(dateIn).format(format);
    } catch (error) {
        return dateIn;
    }
};

export const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
};
