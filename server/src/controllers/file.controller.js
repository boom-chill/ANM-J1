export const downloadFile = async (req, res) => {
    try {
        const { name, path } = req.query
        if (!path)
            return res.status(500).json({ message: 'Không tìm thấy file' })
        return res.download(`./${path}`, `${name}`)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Không tìm thấy file' })
    }
}
