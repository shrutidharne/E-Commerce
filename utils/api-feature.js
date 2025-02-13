class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const copyQueryStr = { ...this.queryStr };

    const toRemoveFields = ["page", "limit", "keyword"];
    toRemoveFields.forEach((key) => delete copyQueryStr[key]);

    //First convert the json to string to edit it
    let strFormatQueryStr = JSON.stringify(copyQueryStr);
    strFormatQueryStr = strFormatQueryStr.replace(
      /\b(lt|lte|gt|ge)\b/g,
      (key) => `$${key}`
    );

    this.query = this.query.find(JSON.parse(strFormatQueryStr));
    return this;
  }

  pagination(numberOfItemsPerPage) {
    const curPage = Number(this.queryStr.page) || 1;
    const skip = (curPage - 1) * numberOfItemsPerPage;

    this.query = this.query.skip(skip).limit(numberOfItemsPerPage);
    return this;
  }
}

module.exports = APIFeatures;
