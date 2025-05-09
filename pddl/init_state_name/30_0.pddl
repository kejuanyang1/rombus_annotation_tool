(define (problem scene1)
  (:domain manip)
  (:objects
    black tape - item
    pencil - item
    glue stick - item
    green marker - item
    stapler - item
  )
  (:init
    (ontable black tape)
    (ontable pencil)
    (ontable glue stick)
    (ontable green marker)
    (ontable stapler)
    (clear black tape)
    (clear pencil)
    (clear glue stick)
    (clear green marker)
    (clear stapler)
    (handempty)
  )
  (:goal (and ))
)