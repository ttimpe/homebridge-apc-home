let axios = require('axios')

import APCDevice from './APCDevice'
import APCOutlet from './APCOutlet'

export default class APCService {
	private client: any
	private app_id: string = 'schneider-5w-id'
	private app_secret: string = 'schneider-4p5If6sO_QS9F0mQLJmOoCxswng'

	private access_token: string = ''
	private refresh_token: string = ''

	constructor() {
		this.client = axios.create()
	}

	async loginUser(email: string, password: string) {
		const url = 'https://user-field.aylanetworks.com/users/sign_in.json'

		const loginObject = {
			"user": {
				"email": email,
				"password": password,
				"application": {
					"app_id": "alya-api-browser-id",
					"app_secret": "alya-api-browser-2tFsUL41FELUlyfrSMEZ4kNKwJg"
				}
			}
		}
		try {
			const res = await this.client.post(url, loginObject)
			if (res.status == 200) {
				this.access_token = res.data.access_token
				this.refresh_token = res.data.refresh_token
				console.log('[APCHome] got login', this.access_token)
				return true
			} else {
				return false
			}
		} catch (error) {
			console.log('[APCHome] could not login user', error)
			return false
		}


	}

	async getDevices() {
		let devices: APCDevice[] = []
		const url = 'https://ads-field.aylanetworks.com/apiv1/devices.json'
		try {
			const res = await this.client.get(url, {
				headers: {
					'Authorization': 'auth_token ' + this.access_token
				}
			})
			if (res.status == 200) {
				for (let i=0; i<res.data.length; i++) {
					let device: APCDevice = res.data[i].device
					device.outlets = await this.getDeviceProperties(device)

					devices.push(device)
				}
			}
		} catch(error) {
			console.log('[APCHome] error while fetching devices', error)
			return devices
		}
		return devices



	}

	async getDeviceProperties(device: APCDevice){
		let outlets: APCOutlet[] = []
		const url = 'https://ads-field.aylanetworks.com/apiv1/dsns/' + device.dsn + '/properties.json'
		try {
			const res = await this.client.get(url, {
				headers: {
					'Authorization': 'auth_token ' + this.access_token
				}
			})
			if (res.status == 200) {
				for (let i=0; i<res.data.length; i++) {
					if (res.data[i].property.name.substring(0,6) == 'outlet' || res.data[i].property.name.substring(0,3) == 'usb') {
						let outlet: APCOutlet = new APCOutlet()
						outlet.id = res.data[i].property.key
						outlet.name = res.data[i].property.display_name
						outlet.isOn = res.data[i].property.value
						outlets.push(outlet)
					}
				}
			}
		} catch(error) {
			console.log('[APCHome] error while getting device properties', error)
			return outlets
		}
		return outlets
	}

	async setPowerState(outlet: APCOutlet, powerState: boolean) {

		const url = 'https://ads-field.aylanetworks.com/apiv1/properties/' + outlet.id + '/datapoints.json'

		const powerStateObject = {
			datapoint: {
				value: (!!powerState)

			}
		}

		try {
			const res = await this.client.post(url, powerStateObject, {
				headers: {
					'Authorization': 'auth_token ' + this.access_token
				}
			})
			if (res.state == 200) {
				return true
			}
		}
		catch {
			return false
		}
		return false
	}
}