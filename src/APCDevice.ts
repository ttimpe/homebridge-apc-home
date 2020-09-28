import APCOutlet from './APCOutlet'

export default class APCDevice {
	public product_name: string
	public model: string
	public dsn: string
	public oem_model: string
	public sw_version: string
	public template_id: number
	public mac: string
	public unique_hardware_id: any
	public hswig: string
	public lan_ip: string
	public connectedAt: Date
	public key :number
	public lan_enabled: boolean
	public has_properties: boolean
	public product_class: string
	public connection_status: string
	public lat: string
	public lng: string
	public locality: string
	public device_type: string

	public outlets: APCOutlet[] = []
}