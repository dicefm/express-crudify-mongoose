export default ({readonly = []}) => {
    return (req, res, next) => {
        for (const path of readonly) {
            delete req.body[path];
        }

        next();
    };
}
