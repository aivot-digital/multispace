<p align="center">
  <a href="https://aivot.de" target="_blank"><img width="150" src="https://aivot.de/img/aivot-logo.svg" alt="Aivot logo"></a>
</p>

<h1 align="center">MultiSpace</h1>
<h3 align="center">Flexible booking of work resources for progressive organizations.</h3>

<p>Our mission is to enable flexible working in shared office space. All resources for efficient and comfortable (collaborative)
work in a hybrid environment are easily accessible and bookable at any time.</p>

<!-- Badges go here -->

# What is MultiSpace?
MultiSpace is a visual resource booking platform for quick and easy booking of work resources.  
We enable organizations to:
- work hybrid in flexible office environments
- keep track of who has booked which desk
- book work resources easily
- obtain transparency over resources

For more information visit us at <https://aivot.de/multispace>




# Who uses MultiSpace?
Currently top secret. If you want to get an introduction into using MultiSpace contact us at <https://aivot.de/kontakt>.




# Setup
MultiSpace was developed as a cloud native application and works best with Docker.


## Docker Setup
If you have docker-compose installed, simply start the `docker-compose.yml` below by running `docker-compose up`.
MultiSpace is now available at <http://127.0.0.1:8000>.

```yaml
# docker-compose.yml
version: "3"
services:
  db:
    image: postgres:14.2
    restart: always
    environment:
      POSTGRES_DB: multispace
      POSTGRES_USER: multispace
      POSTGRES_PASSWORD: multispace
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - ./pg:/var/lib/postgresql/data

  multispace:
    image: ghcr.io/aivot-digital/multispace:2.0.0
    restart: always
    depends_on:
      - db
    volumes:
      - ./media:/app/media
      - static-volume:/app/static
      - web-volume:/app/web
      - run-volume:/app/run
    environment:
      MULTISPACE_PG_HOST: db
      MULTISPACE_PG_PORT: 5432
      MULTISPACE_PG_USER: multispace
      MULTISPACE_PG_PASSWORD: multispace
      MULTISPACE_PG_DATABASE: multispace
      MULTISPACE_HOST: 'http://127.0.0.1:8000'
      MULTISPACE_SECRET: '!!!!insecure-example-key-change-me!!!!'

  web:
    image: nginx
    depends_on:
      - multispace
    volumes:
      - ./media:/app/media:ro
      - static-volume:/app/static:ro
      - web-volume:/app/web:ro
      - run-volume:/app/run:ro
      - ./config/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - "8000:80/tcp"

volumes:
  web-volume:
  static-volume:
  run-volume:
```

After successfully starting the containers, you can create a superuser with the following command:

```bash
docker compose exec multispace python manage.py migrate
docker compose exec multispace python manage.py createsuperuser
```

# Documentation
Code documentation is stored in the project's [GitHub wiki](../../wiki) so that it is as close to the code as possible.

If you are looking for end user documentation visit our [documentation overview](https://aivot.de/docs) and select
the respective project.




# Contributing
Anyone can support us. There are many ways to contribute to MultiSpace. There is certainly one for you as well.

| Support opportunity               | Remark                                                                                                                                                                                                                           |
|-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Spread the word                   | Share your thoughts on this project on social media. Feel free to link to our website or this GitHub repository.                                                                                                                 |
| Share your ideas or give feedback | Share your ideas with us or report a bug. With GitHub Issues and our templates, you can easily bring something up for discussion. Ideally you should read the [contributing guideline](./CONTRIBUTING.md) first.                 |
| Develop                           | Develop together with us on the project. Contributions are managed via GitHub. Please read the [contributing guideline](./CONTRIBUTING.md) first.                                                                                |
| Write out a Bounty                | "Share your ideas" on steroids. If you have a business critical idea and want to see it implemented, you have the chance to set a bounty and accelerate a possible development.                                                  |
| Support us financially            | Donate via [GitHub Sponsors](https://github.com/sponsors/aivot-digital) or [open collective](https://opencollective.com/aivot-digital). All funds are managed transparently and go directly into the development of the project. |

❤ Thank you for contributing! ❤




# Changelog
Please refer to the [changelog](./CHANGELOG.md) for details of what has changed.




# Roadmap
Future functionalities and improvements in prioritized order can be found in the project's [roadmap](https://aivot.de/roadmaps).




# License
This project is licensed under the terms of the [Business Source License](./LICENSE.md).




# Sponsoring services
These great services sponsor Aivot's core infrastructure:

[<img loading="lazy" alt="GitHub" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png" height="25">](https://github.com/)

GitHub allows us to host the Git repository and coordinate contributions.
