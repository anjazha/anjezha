import bcrypt from 'bcrypt';

export async function hasPass(pass:string, slats:number): Promise<string> {
    return await bcrypt.hash(pass, slats);
}

export async function comparePass(pass:string, hashPass:string): Promise<boolean> {
    return await bcrypt.compare(pass, hashPass);
    
}