export interface IformatFilter {
	$or: { [key: string]: { $regex: string; $options: string } }[];
}
