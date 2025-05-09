(define (problem scene1)
  (:domain manip)
  (:objects
    yellow lemon - item
    green chili pepper - item
    purple eggplant - item
    black pen - item
  )
  (:init
    (ontable yellow lemon)
    (ontable green chili pepper)
    (ontable purple eggplant)
    (ontable black pen)
    (clear yellow lemon)
    (clear green chili pepper)
    (clear purple eggplant)
    (clear black pen)
    (handempty)
  )
  (:goal (and ))
)