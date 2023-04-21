variable "region" {
  type = string
}

variable "namespace" {
  type        = string
  default     = null
  description = "Namespace, which could be your organization name or abbreviation, e.g. 'eg' or 'cp'"
}

variable "environment" {
  type        = string
  default     = null
  description = "Environment, e.g. 'uw2', 'us-west-2', OR 'prod', 'staging', 'dev', 'UAT'"
}

variable "stage" {
  type        = string
  default     = null
  description = "Stage, e.g. 'prod', 'staging', 'dev', OR 'source', 'build', 'test', 'deploy', 'release'"
}

variable "name" {
  type        = string
  default     = null
  description = "Solution name, e.g. 'app' or 'jenkins'"
}

variable "attributes" {
  type        = list(string)
  default     = []
  description = "Additional attributes (e.g. `1`)"
}

variable "tags" {
  type        = map(string)
  default     = {}
  description = "Additional tags (e.g. `map('BusinessUnit','XYZ')`"
}

variable "label_order" {
  type        = list(string)
  default     = null
  description = <<-EOT
    The naming order of the id output and Name tag.
    Defaults to ["namespace", "environment", "stage", "name", "attributes"].
    You can omit any of the 5 elements, but at least one must be present.
  EOT
}

variable "route53_hosted_zone_name" {
  type        = string
  description = "Route53 Hosted Zone"
}

variable "cf_logging_enabled" {
  type        = bool
  default     = true
  description = "When true, access logs will be sent to a newly created s3 bucket"
}

variable "cf_log_versioning_enabled" {
  type        = bool
  default     = false
  description = "When true, the access logs bucket will be versioned"
}

variable "cf_log_expiration_days" {
  type        = number
  description = "Number of days after which to expunge the objects"
  default     = 90
}

variable "cf_minimum_protocol_version" {
  type        = string
  description = "Cloudfront TLS minimum protocol version"
  default     = "TLSv1.2_2019"
}

variable "cf_default_ttl" {
  type        = number
  default     = 0
  description = "Default amount of time (in seconds) that an object is in a CloudFront cache"
}

variable "cf_min_ttl" {
  type        = number
  default     = 0
  description = "Minimum amount of time that you want objects to stay in CloudFront caches"
}

variable "cf_max_ttl" {
  type        = number
  default     = 0
  description = "Maximum amount of time (in seconds) that an object is in a CloudFront cache"
}

variable "cf_forward_query_string" {
  type        = bool
  default     = true
  description = "Forward query strings to the origin that is associated with this cache behavior"
}

variable "lambda_versions" {
  type = object({
    cloudfront_headers = number
  })
  description = "Lambdas Edge versions"
}
