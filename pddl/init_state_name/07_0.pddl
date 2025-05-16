(define (problem scene1)
  (:domain manip)
  (:objects
    banana - item
    bunch of red grapes - item
    green apple - item
    yellow lemon - item
    green basket - container
    pink bowl - container
    pink lid - lid
  )
  (:init
    (ontable banana)
    (ontable bunch of red grapes)
    (ontable green apple)
    (ontable yellow lemon)
    (ontable green basket)
    (ontable pink bowl)
    (ontable pink lid)
    (handempty)
    (clear banana)
    (clear bunch of red grapes)
    (clear green apple)
    (clear yellow lemon)
    (clear green basket)
    (clear pink lid)
  )
  (:goal (and ))
)