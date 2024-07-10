import { CLAIM_PROJECT, IProject } from "@/types";
import { komAPI } from "./utils"

/**
 * 
 * @param address user walllet address
 * @param status project type "upcoming", "active", "ended", "vesting"
 * @returns 
 */
export const getProjects = async (status: string, address: string = '') => {
    try {
        const { status: _status, result }: { status: string, result: any } = await komAPI (`https://api.kommunitas.net/v1/launchpad/project/?status=${status}&address=${address}&invested=false`);
        if (_status === 'success') {
            return result;
        } else {
            throw "";
        }
    } catch (err) {
        return [];
    }
}