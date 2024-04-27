import { Injectable } from "@angular/core"

/// factory...
@Injectable({
    providedIn: 'root'
})
export class SettingsStore {
    getBoolSetting(key: string, fallback: boolean) {
        const value = localStorage.getItem(key)
        if (value === 'true') {
            return true
        }
        if (value === 'false') {
            return false
        }
        return fallback

    }
    storeBoolSetting(key: string, value: boolean) {
        localStorage.setItem(key, value ? 'true' : 'false')
    }

    getStringSetting(key: string, fallback: string) {
        const value = localStorage.getItem(key)
        return value === null ? fallback : value
    }
    storeStringSetting(key: string, value: string) {
        localStorage.setItem(key, value)
    }
}