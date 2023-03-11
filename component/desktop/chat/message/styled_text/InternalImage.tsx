import { MessageEntityFileNode } from "../../../../../api/object"

const getImageDisplaySize = (numImages: number) => {
    if (numImages == 1) {
        return 300
    }
    if (numImages == 2) {
        return 200
    }
    if (numImages == 3) {
        return 200
    }
    return 200
}

export const imageEntitiesToElements = (entities: MessageEntityFileNode[]) => {
    const elements = []
    const numImages = entities.length
    const displaySize = getImageDisplaySize(numImages)
    for (const entity of entities) {
        if (entity.file.width >= entity.file.height) {
            elements.push(
                <a href={entity.file.url} target="_blank">
                    <img src={entity.file.url} />
                    <style jsx>{`
                        a {
                            display: block;
                            padding: 4px;
                        }
                        img {
                            width: ${displaySize}px;
                            border-radius: 8px;
                        }
                    `}</style>
                </a>
            )
        } else {
            elements.push(
                <a href={entity.file.url} target="_blank">
                    <img src={entity.file.url} />
                    <style jsx>{`
                        a {
                            display: block;
                            padding: 4px;
                        }
                        img {
                            height: ${displaySize}px;
                            border-radius: 8px;
                        }
                    `}</style>
                </a>
            )
        }
    }
    return (
        <>
            <div className="container">{elements}</div>
            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                }
            `}</style>
        </>
    )
}
