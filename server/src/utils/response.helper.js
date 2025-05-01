class response {
  // Success response status: 200 (success)
  async success(res, msg, data) {
    return res.status(200).json({
      message: msg || "Success",
      variant: "success",
      innerData: data || null,
    });
  }

  // Created response status: 201 (success)
  async created(res, msg, data) {
    return res.status(201).json({
      message: msg || "Created",
      variant: "success",
      innerData: data || null,
    });
  }

  // Info response status: 202 (success)
  async info(res, msg, data) {
    return res.status(202).json({
      message: msg || "Info",
      variant: "info",
      innerData: data || null,
    });
  }

  // Empty response status: 204 (success)
  async empty(res, msg) {
    return res.status(200).json({
      message: msg || "Empty",
      variant: "info",
      innerData: null,
    });
  }

  // Not found response status: 404 (warning)
  async notFound(res, msg, data) {
    return res.status(404).json({
      message: msg || "Not found",
      variant: "warning",
      innerData: data || null,
    });
  }

  //   Warning response status: 400 (warning)
  async warning(res, msg, data) {
    return res.status(400).json({
      message: msg || "Warning",
      variant: "warning",
      innerData: data || null,
    });
  }

  //  Forbidden response status: 403 (error)
  async forbidden(res, msg, data) {
    return res.status(403).json({
      message: msg || "Forbidden",
      variant: "warning",
      innerData: data || null,
    });
  }

  // Unauthorized response status: 401 (error)
  async unauthorized(res, msg, data) {
    return res.status(401).json({
      message: msg || "Unauthorized",
      variant: "error",
      innerData: data || null,
    });
  }

  //   Server error response status: 500 (error)
  async error(res, err) {
    return res.status(500).json({
      message: "An error occurred on the server, please try later",
      variant: "error",
      innerData: null,
      error: err,
    });
  }

  // for 429 status
  async limiter(res, err, min) {
    return res.status(429).json({
      message: `Too many requests from this IP, please try again after ${min} minutes`,
      variant: "error",
      innerData: null,
      error: err,
    });
  }
}

module.exports = new response();
