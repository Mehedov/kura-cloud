export interface ICreateFolder {
	name:string,
	parentId?: string
}

export interface IDeleteFolder {
	id:string,
	type: string
}