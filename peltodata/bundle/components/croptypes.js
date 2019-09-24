
module.exports = {
    cropKeys() {
        const cropKeys = [
            'syysruis',
            'syysvehna',
            'kevatvehna',
            'ohra',
            'kaura',
            'herne',
            'harkapapu',
            'syysrypsi',
            'kevatrypsi',
            'syysrapsi',
            'kevatrapsi',
        ];

        return cropKeys;
    },
    // Add croptype here and matching locale in en.js, fi.js and sv.js
    getCropTypes(localization) {
        const cropKeys = this.cropKeys();

        return cropKeys.map(key => {
            return {
                value: key,
                text: localization.crop_types[key],
            }
        })
    }
};
