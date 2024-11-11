export const isPositiveNumber = (number) => {
    return !isNaN(number) && Number(number) > 0;
}