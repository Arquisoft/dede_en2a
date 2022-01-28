
import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class GetUsersList extends Simulation {

  private val httpProtocol = http
    .baseUrl("http://localhost:3000")
    .inferHtmlResources(AllowList(), DenyList())
    .acceptHeader("*/*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .userAgentHeader("Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0")
  
  private val headers_0 = Map(
  		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  		"Upgrade-Insecure-Requests" -> "1"
  )
  
  private val headers_1 = Map("Accept" -> "image/avif,image/webp,*/*")
  
  private val headers_2 = Map(
  		"If-None-Match" -> """W/"21-Da2z2ryWGAvtwohXYJERIWJgKbU"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_3 = Map(
  		"Access-Control-Request-Headers" -> "content-type",
  		"Access-Control-Request-Method" -> "POST",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_4 = Map(
  		"Content-Type" -> "application/json",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_5 = Map(
  		"If-None-Match" -> """W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val uri1 = "localhost"

  private val scn = scenario("GetUsersList")
    .exec(
      http("request_0")
        .get("/")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("/static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg")
            .headers(headers_1),
          http("request_2")
            .get("http://" + uri1 + ":5000/api/users/list")
            .headers(headers_2)
        )
    )
    .pause(3)
    .exec(
      http("request_3")
        .options("http://" + uri1 + ":5000/api/users/add")
        .headers(headers_3)
        .resources(
          http("request_4")
            .post("http://" + uri1 + ":5000/api/users/add")
            .headers(headers_4)
            .body(RawFileBody("getuserslist/0004_request.txt")),
          http("request_5")
            .get("http://" + uri1 + ":5000/api/users/list")
            .headers(headers_5)
        )
    )

	setUp(scn.inject(constantUsersPerSec(3).during(15))).protocols(httpProtocol)
}