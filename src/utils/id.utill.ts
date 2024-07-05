export async function validateMongodbID(userId: string): Promise<boolean> {
    const regex = /^[0-9a-fA-F]{24}$/;
    return regex.test(userId);
}
