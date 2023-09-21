class apiFeature {
  //1) Filteration
  constructor(requestQuery, query) {
    this.requestQuery = requestQuery;
    this.query = query;
  }

  filter() {
    const queryObject = { ...this.requestQuery };
    const execludeFields = ["page", "limit", "sort", "fields", "keyword"];
    execludeFields.forEach((field) => delete queryObject[field]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  paginate() {
    const page = this.requestQuery.page * 1 || 1;
    const limit = this.requestQuery.limit * 1 || 5;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  sort() {
    if (this.requestQuery.sort) {
      const sortBy = this.requestQuery.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitField() {
    if (this.requestQuery.field) {
      const fields = this.requestQuery.field.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  search() {
    if (this.requestQuery.keyword) {
      const searchQuery = {
        $or: [
          { name: { $regex: this.requestQuery.keyword, $options: "i" } },
          { company: { $regex: this.requestQuery.keyword, $options: "i" } },
        ],
      };
      this.query = this.query.find(searchQuery);
    }
    return this;
  }
}
module.exports = apiFeature;
